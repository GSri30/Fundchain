import smartpy as sp

class FundChain(sp.Contract):
    def __init__(self):
        self.init(
        users = sp.map(
                            tkey=sp.TString,
                            tvalue=sp.TRecord(
                                    uuid=sp.TString,
                                    datetime=sp.TTimestamp,
                                    donated_mutez=sp.TMutez,
                                    email = sp.TString,
                                    posts= sp.TList(sp.TString)
                                    # received_mutez=sp.TMutez
                                )
                            ),
        transactions=sp.map(
                                tkey=sp.TString,
                                tvalue=sp.TList(
                                    sp.TRecord(
                                        from_uuid=sp.TString,
                                        from_address=sp.TAddress,
                                        to_puid=sp.TString,
                                        to_address=sp.TAddress,
                                        amount = sp.TMutez,
                                        comment=sp.TString,
                                        timestamp=sp.TTimestamp
                                    )
                                )
                            ),
        posts=sp.map(
                    tkey=sp.TString,
                    tvalue=sp.TRecord(
                        owner_uid = sp.TString,
                        name = sp.TString,
                        institution = sp.TString,
                        description = sp.TString,
                        post_type = sp.TString,
                        goal=sp.TMutez,
                        timestamp=sp.TTimestamp,
                        received_mutez=sp.TMutez,
                        goal_reached=sp.TBool,
                        address = sp.TAddress,
                        pictures = sp.TList(sp.TString)
                        # supports=sp.TNat,
                        # reports=sp.TNat,
                        # verified=sp.TBool
                    )
                ),
        total_fund=sp.mutez(0),
        total_donors = sp.nat(0),
        total_goals_reached=sp.nat(0),
        total_fundings=sp.nat(0)            
        )
    '''
    Setters
    '''

    @sp.entry_point
    def add_user(self,params):
        '''
        Register
        '''
        sp.set_type(params.uuid,sp.TString)
        sp.set_type(params.email,sp.TString)
        
        sp.verify(self.data.users.contains(params.uuid)==False)
        
        self.data.users[params.uuid]=sp.record(
                                        uuid=params.uuid,
                                        datetime=sp.now,
                                        donated_mutez=sp.mutez(0),
                                        email = params.email,
                                        posts= sp.list([]),
                                    )
        self.data.transactions[params.uuid] = sp.list([])

    @sp.entry_point
    def add_transaction(self,params):
    #   params = from_uuid,from_address,to_puid,amount,comment
        sp.set_type(params.from_uuid,sp.TString)
        sp.set_type(params.from_address,sp.TAddress)
        sp.set_type(params.to_puid,sp.TString)
        sp.set_type(params.amount,sp.TMutez)
        sp.set_type(params.comment,sp.TString)
        sp.verify(self.data.users.contains(params.from_uuid) == True)
        sp.verify(self.data.posts.contains(params.to_puid) == True)
        sp.verify(self.data.posts[params.to_puid].goal_reached == False)
        self.data.transactions[params.from_uuid].push(sp.record(
            from_uuid=params.from_uuid,
            from_address=params.from_address,
            to_puid=params.to_puid,
            to_address= self.data.posts[params.to_puid].address,
            amount = params.amount,
            comment= params.comment,
            timestamp= sp.now
        ))
        self.data.transactions[params.to_puid].push(sp.record(
            from_uuid=params.from_uuid,
            from_address=params.from_address,
            to_puid=params.to_puid,
            to_address=self.data.posts[params.to_puid].address,
            amount = params.amount,
            comment=params.comment,
            timestamp=sp.now
        ))
        # sp.send(self.data.posts[params.to_puid].address, params.amount, message = None)
        
        sp.if self.data.users[params.from_uuid].donated_mutez == sp.mutez(0):
            self.data.total_donors += 1
        
        self.data.posts[params.to_puid].received_mutez += params.amount
        self.data.users[params.from_uuid].donated_mutez += params.amount
        self.data.total_fund += params.amount
        self.data.total_fundings += 1
        
        sp.if self.data.posts[params.to_puid].received_mutez > self.data.posts[params.to_puid].goal:
            self.data.posts[params.to_puid].goal_reached = True
            self.data.total_goals_reached += 1
    
    @sp.entry_point
    def add_post(self,params):
        sp.verify(self.data.posts.contains(params.puid) == False)
        sp.set_type(params.name,sp.TString)
        sp.set_type(params.description,sp.TString)
        sp.set_type(params.institution,sp.TString)
        sp.set_type(params.post_type,sp.TString)
        sp.set_type(params.uuid,sp.TString)
        sp.set_type(params.puid,sp.TString)
        sp.set_type(params.goal,sp.TMutez)
        sp.set_type(params.address,sp.TAddress)
        sp.set_type(params.pictures,sp.TList(sp.TString))
        
        self.data.posts[params.puid]=sp.record(
            owner_uid = params.uuid,
            name = params.name,
            institution = params.institution,
            description = params.description,
            post_type = params.post_type,
            goal=params.goal,
            timestamp=sp.now,
            received_mutez=sp.mutez(0),
            goal_reached=sp.bool(False),
            address = params.address,
            pictures = params.pictures
            # supports=0,
            # reports=0,
            # verified=False
        )
        self.data.transactions[params.puid] = sp.list([])
        self.data.users[params.uuid].posts.push(params.puid)
    
    # @sp.entry_point
    # def support(self):
    #     pass
    
    # @sp.entry_point
    # def report(self):
    #     pass

    # @sp.entry_point
    # def add_comment(self):
    #     '''
    #     For every post, there can only be one comment. Users get this option if they hit on report and there aren't already any comments.
    #     This act as proof-of-work
    #     '''
    #     pass

@sp.add_test(name = "fc testing")
def test():
    scenario = sp.test_scenario()

    fc = FundChain()
    # fc.set_initial_balance(sp.mutez(1000000))
    scenario += fc
    scenario += fc.add_user(uuid = "u00001",email = "user1@gmail.com")
    scenario += fc.add_user(uuid = "u00002",email = "user2@gmail.com")
    scenario += fc.add_user(uuid = "u00003",email = "user3@gmail.com")
    scenario += fc.add_post(uuid = "u00002",puid = "p00001",name="ASD",description="ASD",institution="nsd",post_type="Education",goal = sp.mutez(100),address=sp.address("tz100002"),pictures = ["12123233","12312414"])
    scenario += fc.add_transaction(from_uuid="u00001",from_address=sp.address("tz100001"),to_puid="p00001",amount = sp.mutez(10),comment="Nuv superrraa")
